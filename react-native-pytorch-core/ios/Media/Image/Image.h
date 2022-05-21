/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#import <Foundation/Foundation.h>
#import "cxx/src/torchlive/media/image/IImage.h"

namespace torchlive {
namespace media {

class Image : public IImage {
public:
  Image(UIImage *image) noexcept;
  ~Image() override = default;

  double getWidth() const noexcept override;

  double getHeight() const noexcept override;

  double getNaturalWidth() const noexcept override;

  double getNaturalHeight() const noexcept override;

  double getPixelDensity() const noexcept override;

  std::shared_ptr<IImage> scale(double sx, double sy) const override;

  void close() const override;

private:
  UIImage *_image;
};

} // namespace media
} // namespace torchlive
